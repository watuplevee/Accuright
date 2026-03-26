import jsforce from 'jsforce';

export interface SalesforceLead {
  FirstName: string;
  LastName: string;
  Email: string;
  LeadSource: 'Web' | 'Campaign_2027' | 'Checkout';
  Company?: string;
  AccurightCustomerId__c?: string;
  CampaignInterest__c?: string;
}

interface SalesforceContact {
  FirstName: string;
  LastName: string;
  Email: string;
  AccountId?: string;
  AccurightCustomerId__c?: string;
  LeadSource?: string;
}

interface SalesforceConnectionConfig {
  instanceUrl: string;
  accessToken: string;
  refreshToken: string;
}

let connectionCache: jsforce.Connection | null = null;
let connectionExpiresAt = 0;

async function getConnection(): Promise<jsforce.Connection> {
  const now = Date.now();

  if (connectionCache && now < connectionExpiresAt) {
    return connectionCache;
  }

  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const securityToken = process.env.SALESFORCE_SECURITY_TOKEN ?? '';
  const loginUrl = process.env.SALESFORCE_LOGIN_URL ?? 'https://login.salesforce.com';

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error(
      'Missing required Salesforce environment variables: SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_USERNAME, SALESFORCE_PASSWORD'
    );
  }

  const oauth2 = new jsforce.OAuth2({
    loginUrl,
    clientId,
    clientSecret,
  });

  const conn = new jsforce.Connection({ oauth2, loginUrl });

  await conn.login(username, password + securityToken);

  connectionCache = conn;
  // Cache connection for 110 minutes (Salesforce tokens last 2 hours by default)
  connectionExpiresAt = now + 110 * 60 * 1000;

  conn.on('refresh', (accessToken: string, _res: unknown) => {
    // Update the cache with refreshed token
    connectionExpiresAt = Date.now() + 110 * 60 * 1000;
  });

  return conn;
}

export async function createOrUpdateLead(data: SalesforceLead): Promise<string> {
  const conn = await getConnection();

  const leadData: Record<string, unknown> = {
    FirstName: data.FirstName,
    LastName: data.LastName,
    Email: data.Email,
    LeadSource: data.LeadSource,
    Company: data.Company ?? 'Individual',
  };

  if (data.AccurightCustomerId__c) {
    leadData['AccurightCustomerId__c'] = data.AccurightCustomerId__c;
  }
  if (data.CampaignInterest__c) {
    leadData['CampaignInterest__c'] = data.CampaignInterest__c;
  }

  // Upsert by Email using the standard Email external id equivalent
  // We query first, then insert or update accordingly
  const existingLeads = await conn
    .sobject('Lead')
    .find({ Email: data.Email, IsConverted: false }, ['Id'])
    .limit(1)
    .execute();

  let leadId: string;

  if (existingLeads.length > 0) {
    const existing = existingLeads[0] as { Id: string };
    leadId = existing.Id;
    await conn.sobject('Lead').update({ Id: leadId, ...leadData });
  } else {
    const result = await conn.sobject('Lead').create(leadData);
    if (!result.success) {
      const errors = (result as unknown as { errors: unknown[] }).errors;
      throw new Error(`Failed to create Salesforce lead: ${JSON.stringify(errors)}`);
    }
    leadId = result.id;
  }

  return leadId;
}

export async function createContact(data: SalesforceContact): Promise<string> {
  const conn = await getConnection();

  const contactData: Record<string, unknown> = {
    FirstName: data.FirstName,
    LastName: data.LastName,
    Email: data.Email,
  };

  if (data.AccountId) {
    contactData['AccountId'] = data.AccountId;
  }
  if (data.AccurightCustomerId__c) {
    contactData['AccurightCustomerId__c'] = data.AccurightCustomerId__c;
  }
  if (data.LeadSource) {
    contactData['LeadSource'] = data.LeadSource;
  }

  // Check for existing contact by email
  const existing = await conn
    .sobject('Contact')
    .find({ Email: data.Email }, ['Id'])
    .limit(1)
    .execute();

  let contactId: string;

  if (existing.length > 0) {
    const existingContact = existing[0] as { Id: string };
    contactId = existingContact.Id;
    await conn.sobject('Contact').update({ Id: contactId, ...contactData });
  } else {
    const result = await conn.sobject('Contact').create(contactData);
    if (!result.success) {
      const errors = (result as unknown as { errors: unknown[] }).errors;
      throw new Error(`Failed to create Salesforce contact: ${JSON.stringify(errors)}`);
    }
    contactId = result.id;
  }

  return contactId;
}

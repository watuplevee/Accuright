export interface ConstantContactSubscribeParams {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

interface ConstantContactPayload {
  email_address: {
    address: string;
    permission_to_send: 'explicit';
  };
  first_name?: string;
  last_name?: string;
  list_memberships: string[];
  custom_fields?: Array<{
    custom_field_id: string;
    value: string;
  }>;
}

export async function subscribeContact(
  email: string,
  firstName?: string,
  lastName?: string,
  source?: string
): Promise<void> {
  const accessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN;
  const listId = process.env.CONSTANT_CONTACT_LIST_ID;

  if (!accessToken) {
    throw new Error('CONSTANT_CONTACT_ACCESS_TOKEN environment variable is not set');
  }
  if (!listId) {
    throw new Error('CONSTANT_CONTACT_LIST_ID environment variable is not set');
  }

  const payload: ConstantContactPayload = {
    email_address: {
      address: email,
      permission_to_send: 'explicit',
    },
    list_memberships: [listId],
  };

  if (firstName) {
    payload.first_name = firstName;
  }
  if (lastName) {
    payload.last_name = lastName;
  }

  const response = await fetch('https://api.cc.email/v3/contacts/sign_up_form', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // 409 Conflict means the contact already exists and is active — treat as success
    if (response.status === 409) {
      return;
    }

    throw new Error(
      `Constant Contact API error ${response.status}: ${errorText}`
    );
  }
}

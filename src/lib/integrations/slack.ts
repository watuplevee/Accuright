export interface SlackOrderNotification {
  orderNumber: string;
  customerEmail: string;
  total: number; // in cents
  items: Array<{
    name: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number; // in cents
  }>;
  stripePaymentIntentId: string;
}

interface SlackBlock {
  type: string;
  [key: string]: unknown;
}

interface SlackPayload {
  blocks: SlackBlock[];
  text?: string;
}

async function postToSlack(webhookUrl: string, payload: SlackPayload): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Slack webhook failed with status ${response.status}: ${errorText}`
    );
  }
}

export async function sendSupportMessage(params: {
  message: string;
  name?: string;
  email?: string;
  orderId?: string;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_SUPPORT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('SLACK_SUPPORT_WEBHOOK_URL environment variable is not set');
  }

  const { message, name, email, orderId } = params;
  const timestamp = new Date().toISOString();

  const fields: Array<{ type: string; text: { type: string; text: string; emoji?: boolean } }> = [
    {
      type: 'mrkdwn',
      text: `*Submitted At:*\n${timestamp}`,
    },
  ];

  if (name) {
    fields.push({
      type: 'mrkdwn',
      text: `*Name:*\n${name}`,
    });
  }

  if (email) {
    fields.push({
      type: 'mrkdwn',
      text: `*Email:*\n${email}`,
    });
  }

  if (orderId) {
    fields.push({
      type: 'mrkdwn',
      text: `*Order ID:*\n${orderId}`,
    });
  }

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: ':headphones: New Support Request',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields,
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${message}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Accuright Support Bot | Reply to this ticket in your helpdesk.',
        },
      ],
    },
  ];

  await postToSlack(webhookUrl, {
    blocks,
    text: `New support request from ${name ?? email ?? 'anonymous'}`,
  });
}

export async function sendOrderNotification(
  notification: SlackOrderNotification
): Promise<void> {
  const webhookUrl = process.env.SLACK_ORDERS_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('SLACK_ORDERS_WEBHOOK_URL environment variable is not set');
  }

  const { orderNumber, customerEmail, total, items, stripePaymentIntentId } = notification;
  const formattedTotal = (total / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const itemLines = items
    .map((item) => {
      const itemPrice = (item.price / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      const details = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
        .filter(Boolean)
        .join(' | ');
      return `• *${item.name}* x${item.quantity} — ${itemPrice}${details ? `\n  ${details}` : ''}${item.sku ? `\n  SKU: ${item.sku}` : ''}`;
    })
    .join('\n');

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: ':tada: New Order Received!',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Order Number:*\n#${orderNumber}`,
        },
        {
          type: 'mrkdwn',
          text: `*Customer:*\n${customerEmail}`,
        },
        {
          type: 'mrkdwn',
          text: `*Order Total:*\n${formattedTotal}`,
        },
        {
          type: 'mrkdwn',
          text: `*Payment Intent:*\n\`${stripePaymentIntentId}\``,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Items (${items.length}):*\n${itemLines}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Accuright Order System | ${new Date().toUTCString()}`,
        },
      ],
    },
  ];

  await postToSlack(webhookUrl, {
    blocks,
    text: `New order #${orderNumber} from ${customerEmail} — ${formattedTotal}`,
  });
}

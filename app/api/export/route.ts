import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { platform, credentials, bugData } = await req.json();

    // 1. Exportación a JIRA CLOUD
    if (platform === 'jira') {
      const { domain, email, apiToken, projectKey } = credentials;
      const authHeader = Buffer.from(`${email}:${apiToken}`).toString('base64');

      const res = await fetch(`https://${domain}.atlassian.net/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            summary: bugData.title,
            description: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: bugData.description || 'Reporte de error enviado desde AI Bug Reporter.' }],
                },
              ],
            },
            issuetype: { name: 'Bug' },
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errorMessages?.[0] || 'Error al conectar con Jira.');
      }

      const data = await res.json();
      return NextResponse.json({ success: true, issueUrl: `https://${domain}.atlassian.net/browse/${data.key}` });
    }

    // 2. Exportación a TRELLO
    if (platform === 'trello') {
      const { apiKey, token, listId } = credentials;

      const res = await fetch(
        `https://api.trello.com/1/cards?idList=${listId}&key=${apiKey}&token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: bugData.title,
            desc: bugData.description,
          }),
        }
      );

      if (!res.ok) throw new Error('Error al crear la tarjeta en Trello.');
      const data = await res.json();
      return NextResponse.json({ success: true, issueUrl: data.url });
    }

    // 3. Exportación a AZURE DEVOPS
    if (platform === 'azure') {
      const { organization, project, pat } = credentials;
      const authHeader = Buffer.from(`:${pat}`).toString('base64');

      const res = await fetch(
        `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/$Bug?api-version=7.0`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json-patch+json',
          },
          body: JSON.stringify([
            { op: 'add', path: '/fields/System.Title', value: bugData.title },
            { op: 'add', path: '/fields/System.Description', value: bugData.description },
          ]),
        }
      );

      if (!res.ok) throw new Error('Error al crear el Bug en Azure DevOps.');
      const data = await res.json();
      return NextResponse.json({ success: true, issueUrl: data._links.html.href });
    }

    return NextResponse.json({ error: 'Plataforma no soportada.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
    const { platform, title, description, credentials } = await request.json();

    let response;

    switch (platform) {
        case 'jira':
            response = await fetch(`https://<your-domain>.atlassian.net/rest/api/3/issue`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${credentials.email}:${credentials.apiToken}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: {
                        summary: title,
                        description: description,
                        issuetype: { id: '10001' }, // Adjust as necessary
                    }
                }),
            });
            break;

        case 'trello':
            response = await fetch(`https://api.trello.com/1/cards?key=${credentials.key}&token=${credentials.token}&idList=${credentials.idList}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name: title, desc: description }),
            });
            break;

        case 'azure':
            response = await fetch(`https://dev.azure.com/${credentials.organization}/${credentials.project}/_apis/wit/workitems/$Bug?api-version=7.0`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`:${credentials.pat}`).toString('base64')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    { op: 'add', path: '/fields/System.Title', value: title },
                    { op: 'add', path: '/fields/System.Description', value: description },
                ]),
            });
            break;

        default:
            return NextResponse.json({ success: false, message: 'Invalid platform' }, { status: 400 });
    }

    const jsonResponse = await response.json();
    if (response.ok) {
        return NextResponse.json({ success: true, data: jsonResponse });
    } else {
        return NextResponse.json({ success: false, message: jsonResponse }, { status: response.status });
    }
}
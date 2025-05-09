import {appendFile, readFile} from 'node:fs/promises';
import {createServer} from 'node:http';

createServer(async (request, response) => {
	const chat = new URL(`http://a${request.url}`).searchParams.get('chat');
	if (chat) {
		await appendFile('a.txt', `${chat}\n`, {flag: 'a+', encoding: 'utf8'});
		response.writeHead(303, {location: '/'}).end(); // without query
	} else {
		response.writeHead(200, {
			'content-type': 'text/html',
		}).end(
			`<meta charset="utf-8"><meta name=viewport content="width=device-width,initial-scale=1"><pre style="white-space:pre-wrap;text-indent:4ch hanging each-line">${
				(await readFile('a.txt', {flag: 'a+', encoding: 'utf8'}))
					// ugh, fine, i'll html escape it. no xss for you
					.replace(/[<>&'"]/g, match => ({
						'<': '&lt;',
						'>': '&gt;',
						'&': '&amp;',
						'\'': '&apos;',
						'"': '&quot;',
					})[match])
			}</pre><a style="float:right" href="https://github.com/ewwwin/minimum-viable-chat">source</a><form><input type=text name=chat autofocus><button>send`
		);
	}
}).listen(process.env.PORT || 80, () => console.log(`hiiiii ^w^ hai hii :3`));

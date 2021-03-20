var http = require('http')
const https = require('https')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

http
  .createServer(function (req, res) {
    // console.log(req)
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World\n')
  })
  .listen(4200)
  const args = process.argv.slice(2)


  async function retrieveNav() {
    let result = true;
    const options = {
      hostname: 'codequiz.azurewebsites.net',
      port: 443,
      path: '',
      method: 'GET',
      headers: {'Cookie': 'hasCookie=true'}
    }

    const req = https.request(options, response => {
      response.setEncoding('utf8');
      response.on('data', data => {
        const start = data.search('<table>');
        const end = data.search('</table>')
        table = data.slice(start,end)
        const { document } = (new JSDOM(table)).window
        var obj  = [].map.call(document.querySelectorAll('tr'), tr => {
            return [].slice.call(tr.querySelectorAll('td')).reduce( (a,b,i) => {
                return a['prop' + (i+1)] = b.textContent.trim(), a;
            }, {});
        });

        obj.forEach(element => {
          if(element.prop1 != undefined) {
            if(element.prop1 == args[0]) {
              console.log(element.prop2)
            }
          }
        })
        
      });

      response.on('end', () => {
      });
    });
    req.on('error', error => {
      console.error(error)
    })
    
    req.end()
    return result;
    
}

const data = retrieveNav();
// console.log('data',data);
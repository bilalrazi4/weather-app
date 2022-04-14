import fs from "fs";
import http from "http";
import requests from "requests";

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal,orgVal)=>{
    let temp = tempVal.replace("{%currTemp%}",orgVal.main.temp);
    temp = temp.replace("{%minTemp%}",orgVal.main.temp_min);
    temp = temp.replace("{%maxTemp%}",orgVal.main.temp_max);
    temp = temp.replace("{%city%}",orgVal.name);
    temp = temp.replace("{%country%}",orgVal.sys.country);
    temp = temp.replace("{%tempStatus%}",orgVal.weather[0].main);
    console.log(orgVal.weather[0].main);
    return temp;

}
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=b58f370388d7084911167e1757375222")
      .on("data", function (chunk) {
          const objData = JSON.parse(chunk);
        let arr = [objData];
        const realdata = arr.map((val)=>replaceVal(homeFile,val)).join("");
        res.write(realdata);

      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        
      });
  }
  else{
      res.end("FILE NOT FOUND");
  }
});

server.listen(8000,"127.0.0.1");

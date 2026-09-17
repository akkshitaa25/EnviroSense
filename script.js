// EnviroSense Dashboard Script
const CHANNEL_ID="3258324";
const READ_API_KEY="YY7D5HJ9555Q4YGK";
const URL=`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

const $=id=>document.getElementById(id);

const els={
 temp:$("temperature"), hum:$("humidity"), air:$("air"), light:$("light"),
 ihi:$("ihi"), conf:$("confidence"), pred:$("prediction"), trend:$("trend"),
 status:$("overallStatus"), ai:$("aiInsight"), cause:$("rootCause"),
 rec:$("recommendations"), updated:$("lastUpdated"),
 wifi:$("wifiStatus"), cloud:$("cloudStatus"), sensors:$("sensorStatus"),
 theme:$("themeToggle"), co2: $("co2Demo")
};

if(els.theme){
  els.theme.onclick=()=>{
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    els.theme.textContent=document.body.classList.contains("dark")
      ?"☀ Light Mode":"🌙 Dark Mode";
  };
}

const chartCanvas=$("sensorChart");
let chart=null;
if(chartCanvas){
 chart=new Chart(chartCanvas,{
   type:"line",
   data:{
     labels:[],
     datasets:[
      {label:"Temperature",data:[]},
      {label:"Humidity",data:[]},
      {label:"Air Quality",data:[]},
      {label:"Indoor Health Index",data:[]}
     ]
   },
   options:{responsive:true,maintainAspectRatio:false}
 });
}

let previousAQ=null;

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function calcIHI(t,h,aq,l){
  const ts=100-Math.abs(t-25)*5;
  const hs=100-Math.abs(h-50)*2;
  const aqs=100-clamp(aq/40,0,100);
  const ls=100-Math.abs(l-2000)/20;
  return Math.round(clamp(ts*0.3+hs*0.25+aqs*0.3+ls*0.15,0,100));
}

function confidence(t,h,aq){
  let c=100;
  if(isNaN(t)||isNaN(h)) c-=40;
  if(aq<0) c-=20;
  return clamp(c,0,100);
}

async function refresh(){
 try{
   if(els.wifi) els.wifi.textContent="Connected";
   const res=await fetch(URL);
   const d=await res.json();
   if(els.cloud) els.cloud.textContent="Connected";

   const t=parseFloat(d.field1);
   const h=parseFloat(d.field2);
   const aq=parseFloat(d.field3);
   const light=parseFloat(d.field4);

   const demoCO2 = (0.18 + Math.random() * 0.04).toFixed(2);
    els.co2.textContent = demoCO2 + " %";

   const ihi=d.field5?parseFloat(d.field5):calcIHI(t,h,aq,light);
   const conf=d.field6?parseFloat(d.field6):confidence(t,h,aq);
   const pred=d.field7?parseFloat(d.field7):(previousAQ?aq+(aq-previousAQ)*2:aq);

   let trend="➡ Stable";
   if(previousAQ!==null){
      if(aq>previousAQ) trend="⬆ Rising";
      if(aq<previousAQ) trend="⬇ Falling";
   }
   previousAQ=aq;

   els.temp.textContent=t.toFixed(1)+" °C";
   els.hum.textContent=h.toFixed(1)+" %";
   els.air.textContent=Math.round(aq);
   els.light.textContent=Math.round(light)+" lx";
   els.ihi.textContent=ihi+"/100";
   els.conf.textContent=conf+"%";
   els.pred.textContent=Math.round(pred);
   els.trend.textContent=trend;

   let state="Excellent 🟢";
   if(ihi<80) state="Good 🟡";
   if(ihi<60) state="Moderate 🟠";
   if(ihi<40) state="Poor 🔴";
   els.status.textContent="Environment Status: "+state;

   let cause="Environment is healthy.";
   const tips=[];
   if(aq>3000){cause="Poor air quality.";tips.push("Open windows / improve ventilation.");}
   if(t>30) tips.push("Reduce room temperature.");
   if(h>70) tips.push("Reduce humidity.");
   if(light<800) tips.push("Increase room lighting.");
   if(!tips.length) tips.push("No action required.");

   els.ai.textContent=`Indoor Health Index: ${ihi}. Predicted AQ: ${Math.round(pred)}.`;
   els.cause.textContent=cause;
   els.rec.innerHTML=tips.map(x=>`<li>${x}</li>`).join("");
   els.updated.textContent=new Date().toLocaleTimeString();
   if(els.sensors) els.sensors.textContent="Healthy";

   if(chart){
      const tm=new Date().toLocaleTimeString();
      chart.data.labels.push(tm);
      chart.data.datasets[0].data.push(t);
      chart.data.datasets[1].data.push(h);
      chart.data.datasets[2].data.push(aq);
      chart.data.datasets[3].data.push(ihi);
      if(chart.data.labels.length>20){
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds=>ds.data.shift());
      }
      chart.update();
   }
 }catch(err){
   console.error(err);
   if(els.cloud) els.cloud.textContent="Offline";
   if(els.wifi) els.wifi.textContent="Disconnected";
 }
}

refresh();
setInterval(refresh,15000);

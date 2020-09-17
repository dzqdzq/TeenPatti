const {getCardType, sortCardList, dumpCards, dumpCardType} = require('./logic');

function test(){
  let testData = [
    [0x11,0x01,0x31],
    [0x13,0x11,0x12],
    [0x11,0x2C,0x3D],
    [0x15,0x19,0x1D],
    [0x15,0x22,0x35],
    [0x11,0x22,0x3D],
  ];

  testData.forEach(d=>{
    dumpCardType(getCardType(d));
    dumpCards(sortCardList(d));
    console.log("");
  });
}

// 测试100万次
function bench(){
  let colors = [0x0,0x10,0x20,0x30];
  let values = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D];
  let N = values.length;
  function randCard(){
    let c = colors[Math.floor(Math.random()*4)];
    let v = values[Math.floor(Math.random()*N)];
    return c | v;
  }
  console.time();
  for(let i=0;i<1000000;i++){
    getCardType([randCard(),randCard(),randCard()]);
  }
  console.timeEnd();
}

function main(){
  // test();
  bench();
}

main();
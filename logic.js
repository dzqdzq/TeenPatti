let def = require('./def');
const {
  LOGIC_MASK_VALUE, 
  LOGIC_MASK_COLOR, 
  RUN, 
  RealValues,
  CardString,
  SuitMapString,
  CardTypeString
} = def;

function color(c) {
  return c & LOGIC_MASK_COLOR;
}

function value(c) {
  return RealValues[c & LOGIC_MASK_VALUE];
}

// 如果是，返回权重
function checkRun(values) {
  let str = CardString[values[0]] + CardString[values[1]] + CardString[values[2]];
  return RUN[str];
}

// 获取散牌权重-从小到大
function getSanPaiWeight(values) {
  return values[0] + values[1] * 0xf + values[2] * 0xff;
}

// 排列扑克
// down = true 表示降序
// down = false 表示升序，即从小到大
function sortCardList(cards, down=true) {
  let downFunc = (a,b)=>value(b) - value(a);
  let upFunc = (a,b)=>value(a) - value(b);
  return cards.sort(down? downFunc: upFunc);
}

// 获取牌型
function getCardType(cards) {
  if (cards.length !== 3) {
    return;
  }

  let colors = [
    color(cards[0]),
    color(cards[1]),
    color(cards[2]),
  ];
  let sameColor = colors[0] === colors[1] && colors[0] === colors[2];

  let values = [
    value(cards[0]),
    value(cards[1]),
    value(cards[2]),
  ];
  values.sort((a, b)=>a - b);// 从小到大

  let type = def.CT_SINGLE;
  let weight = 0;// 牌型权重,衡量3张牌的大小

  let valueCount = 0;
  if (values[0] === values[1]) {
    valueCount++;
  }

  if (values[1] === values[2]) {
    valueCount++;
  }

  if (valueCount === 2) {
    type = def.CT_BAO_ZI;// 豹子
    weight = values[0];
  } else if (valueCount === 1) {
    type = def.CT_DOUBLE;// 对子
    weight = values[1] * 100;
    weight += (values[0] === values[1]) ? values[2] : values[0];
  } else {
    let run = checkRun(values);
    if (sameColor) {
      if (run > 0) { // 同花顺
        type = def.CT_SHUN_JIN;
        weight = run;
      } else { // 同花
        type = def.CT_JIN_HUA;
        weight = getSanPaiWeight(values);
      }
    } else if (run > 0) { // 顺子
      type = def.CT_SHUN_ZI;
      weight = run;
    } else { // 单张
      type = def.CT_SINGLE;
      weight = getSanPaiWeight(values);
    }
  }

  weight += type*0xfff;
  return {t: type, v: weight, d: cards};
}

// 比较牌型
// >0 表示 a>b
// =0 表示 a=b
// <0 表示 a<b
function compareCardType(a, b) {
  return a.v - b.v;
}

/**
 * @description
 * 对比扑克  0:平局 >0胜利  <0失败
 * @param {array} a 牌数据
 * @param {array} b 牌数据
 * @returns {number}
 */
function compareCard(a, b) {
  let aType = getCardType(a);
  let bType = getCardType(b);
  return compareCardType(aType, bType);
}

// 牌面
function getCardString(card){
  return SuitMapString[color(card)] + CardString[value(card)];
}

function dumpCards(cards){
  console.log("牌值：", cards.map(getCardString).join(","));
}

// 打印牌型
function dumpCardType(cardType){
  const {d,t,v} = cardType;
  dumpCards(d);
  console.log("牌型：", CardTypeString[t]);
  console.log("权重：", v);
}


module.exports = {
  getCardType,
  compareCardType,
  compareCard,
  sortCardList,
  checkRun,
  getSanPaiWeight,
  value,
  color,
  dumpCards,
  dumpCardType,
};
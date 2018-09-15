/* /src/javascript/utils/names.js */

// names applied in the following function.
const names = [
  { name: '秋元 真夏', hiragana : 'あきもと まなつ', roma: 'manatsu akimoto', nickname: ['嫂子'] },
  { name: '生田 絵梨花', hiragana : 'いくた えりか', roma: 'erika ikuta', nickname: ['花花','画伯','ET'] },
  { name: '伊藤 かりん', hiragana : 'いとう かりん', roma: 'karin itou', nickname: [] },
  { name: '伊藤 純奈', hiragana : 'いとう じゅんな', roma: 'jyunna itou', nickname: [] },
  { name: '伊藤 理々杏', hiragana : 'いとう りりあ', roma: 'riria itou', nickname: [] },
  { name: '井上 小百合', hiragana : 'いのうえ さゆり', roma: 'sayuri inoue', nickname: [] },
  { name: '岩本 蓮加', hiragana : 'いわもと れんか', roma: 'renka iwamoto', nickname: ['莲糖'] },
  { name: '梅澤 美波', hiragana : 'うめざわ みなみ', roma: 'minami umezawa', nickname: [] },
  { name: '衛藤 美彩', hiragana : 'えとう みさ', roma: 'misa etou', nickname: [] },
  { name: '大園 桃子', hiragana : 'おおぞの ももこ', roma: 'momoko oozono', nickname: [] },
  { name: '川後 陽菜', hiragana : 'かわご ひな', roma: 'hina kawago', nickname: [] },
  { name: '北野 日奈子', hiragana : 'きたの ひなこ', roma: 'hinako kitano', nickname: ['贝贝'] },
  { name: '久保 史緒里', hiragana : 'くぼ しおり', roma: 'shiori kubo', nickname: ['ten'] },
  { name: '齋藤 飛鳥', hiragana : 'さいとう あすか', roma: 'asuka saitou', nickname: ['飞鸟'] },
  { name: '斉藤 優里', hiragana : 'さいとう ゆうり', roma: 'yuuri saitou', nickname: ['优蛋'] },
  { name: '阪口 珠美', hiragana : 'さかぐち たまみ', roma: 'tamami sakaguchi', nickname: [] },
  { name: '桜井 玲香', hiragana : 'さくらい れいか', roma: 'reika sakurai', nickname: ['废队'] },
  { name: '佐々木 琴子', hiragana : 'ささき ことこ', roma: 'kotoko sasaki', nickname: ['KTK','ktk'] },
  { name: '佐藤 楓', hiragana : 'さとう かえで', roma: 'kaede satou', nickname: ['den'] },
  { name: '白石 麻衣', hiragana : 'しらいし まい', roma: 'mai shiraishi', nickname: ['白麻'] },
  { name: '新内 眞衣', hiragana : 'しんうち まい', roma: 'mai shinuchi', nickname: ['BBA','水泥棒'] },
  { name: '鈴木 絢音', hiragana : 'すずき あやね', roma: 'ayane suzuki', nickname: ['飞机音'] },
  { name: '高山 一実', hiragana : 'たかやま かずみ', roma: 'kazumi takayama', nickname: ['肘哥','教主'] },
  { name: '寺田 蘭世', hiragana : 'てらだ らんぜ', roma: 'ranze terada', nickname: ['兰兰'] },
  { name: '中田 花奈', hiragana : 'なかだ かな', roma: 'kana nakada', nickname: [] },
  { name: '中村 麗乃', hiragana : 'なかむら れの', roma: 'reno nakamura', nickname: [] },
  { name: '西野 七瀬', hiragana : 'にしの ななせ', roma: 'nanase nishino', nickname: ['7'] },
  { name: '能條 愛未', hiragana : 'のうじょう あみ', roma: 'ami noujyou', nickname: ['脚','Johnson'] },
  { name: '樋口 日奈', hiragana : 'ひぐち ひな', roma: 'hina higuchi', nickname: [] },
  { name: '星野 みなみ', hiragana : 'ほしの みなみ', roma: 'minami hoshino', nickname: ['小南','18'] },
  { name: '堀 未央奈', hiragana : 'ほり みおな', roma: 'miona hori', nickname: ['猴莉'] },
  { name: '松村 沙友理', hiragana : 'まつむら さゆり', roma: 'sayuri matsumura', nickname: ['傻'] },
  { name: '向井 葉月', hiragana : 'むかい はづき', roma: 'hazuki mukai', nickname: ['叶月'] },
  { name: '山崎 怜奈', hiragana : 'やまざき れな', roma: 'rena yamazaki', nickname: ['学霸'] },
  { name: '山下 美月', hiragana : 'やました みづき', roma: 'mizuki yamashita', nickname: [] },
  { name: '吉田 綾乃クリスティー', hiragana : 'よしだ あやのくりすてぃー', roma: 'ayanochristie yoshida', nickname: [] },
  { name: '与田 祐希', hiragana : 'よだ ゆうき', roma: 'yuuki yoda', nickname: [] },
  { name: '若月 佑美', hiragana : 'わかつき ゆみ', roma: 'yumi wakatsuki', nickname: ['月少'] },
  { name: '渡辺 みり愛', hiragana : 'わたなべ みりあ', roma: 'miria watanabe', nickname: [] },
  { name: '和田 まあや', hiragana : 'わだ まあや', roma: 'maaya wada', nickname: ['baka'] },
]
/**
 * Match the input string (name) with the full name infomation.
 * the function will match all the property of each full name infomation object,
 * any successful match of property will result in a push action to the result array.
 * according to the times of successful matches to the properties of a full name information object,
 * the result will have a priority on which we based to sort the final result.
 * @param names applied
 * @param string input string
 */
export const matches = ((names) => (string) => {
  if (string === '')
    return [];
  const result = [];
  names.forEach((item) => {
    let priority = 0;
    for (let key of Object.keys(item)) {
      const value = item[key];
      const regex = new RegExp(string);
      if (typeof value === 'string') {
        priority += regex.test(value) ? 1 : 0;
      } else {
        if (value.length !== 0) {
          priority = value.reduce((_acc, _item) => {
            return _acc += regex.test(_item) ? 1 : 0;
          }, priority)
        }
      }
    }
    if (!!priority) {
      result.push({info: item, priority: priority});
    }
  });

  const push = (arr, ...item) => {
    arr.push(...item);
    return arr;
  }
  // quick sort
  const qs = (arr) => {
    if (arr.length === 0) return arr;
    const h =  arr.pop();
    const smaller = qs(arr.filter(x => x.priority > h.priority));
    const bigger = qs(arr.filter(x => x.priority <= h.priority));
    return push(smaller,h, ...bigger);
  }
  return qs(result);
})(names);


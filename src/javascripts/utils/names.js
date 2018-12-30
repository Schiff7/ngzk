/* /src/javascript/utils/names.js */

// names applied in the following function.
const members = [
  { name: '秋元 真夏', hiragana : 'あきもと まなつ', roma: 'manatsu akimoto', nickname: [] },
  { name: '生田 絵梨花', hiragana : 'いくた えりか', roma: 'erika ikuta', nickname: [] },
  { name: '伊藤 かりん', hiragana : 'いとう かりん', roma: 'karin itou', nickname: [] },
  { name: '伊藤 純奈', hiragana : 'いとう じゅんな', roma: 'junna itou', nickname: [] },
  { name: '伊藤 理々杏', hiragana : 'いとう りりあ', roma: 'riria itou', nickname: [] },
  { name: '井上 小百合', hiragana : 'いのうえ さゆり', roma: 'sayuri inoue', nickname: [] },
  { name: '岩本 蓮加', hiragana : 'いわもと れんか', roma: 'renka iwamoto', nickname: [] },
  { name: '梅澤 美波', hiragana : 'うめざわ みなみ', roma: 'minami umezawa', nickname: [] },
  { name: '衛藤 美彩', hiragana : 'えとう みさ', roma: 'misa etou', nickname: [] },
  { name: '大園 桃子', hiragana : 'おおぞの ももこ', roma: 'momoko oozono', nickname: [] },
  { name: '川後 陽菜', hiragana : 'かわご ひな', roma: 'hina kawago', nickname: [] },
  { name: '北野 日奈子', hiragana : 'きたの ひなこ', roma: 'hinako kitano', nickname: [] },
  { name: '久保 史緒里', hiragana : 'くぼ しおり', roma: 'shiori kubo', nickname: [] },
  { name: '齋藤 飛鳥', hiragana : 'さいとう あすか', roma: 'asuka saitou', nickname: [] },
  { name: '斉藤 優里', hiragana : 'さいとう ゆうり', roma: 'yuuri saitou', nickname: [] },
  { name: '阪口 珠美', hiragana : 'さかぐち たまみ', roma: 'tamami sakaguchi', nickname: [] },
  { name: '桜井 玲香', hiragana : 'さくらい れいか', roma: 'reika sakurai', nickname: [] },
  { name: '佐々木 琴子', hiragana : 'ささき ことこ', roma: 'kotoko sasaki', nickname: [] },
  { name: '佐藤 楓', hiragana : 'さとう かえで', roma: 'kaede satou', nickname: [] },
  { name: '白石 麻衣', hiragana : 'しらいし まい', roma: 'mai shiraishi', nickname: [] },
  { name: '新内 眞衣', hiragana : 'しんうち まい', roma: 'mai shinuchi', nickname: [] },
  { name: '鈴木 絢音', hiragana : 'すずき あやね', roma: 'ayane suzuki', nickname: [] },
  { name: '高山 一実', hiragana : 'たかやま かずみ', roma: 'kazumi takayama', nickname: [] },
  { name: '寺田 蘭世', hiragana : 'てらだ らんぜ', roma: 'ranze terada', nickname: [] },
  { name: '中田 花奈', hiragana : 'なかだ かな', roma: 'kana nakada', nickname: [] },
  { name: '中村 麗乃', hiragana : 'なかむら れの', roma: 'reno nakamura', nickname: [] },
  { name: '西野 七瀬', hiragana : 'にしの ななせ', roma: 'nanase nishino', nickname: ['7'] },
  { name: '能條 愛未', hiragana : 'のうじょう あみ', roma: 'ami noujo', nickname: [] },
  { name: '樋口 日奈', hiragana : 'ひぐち ひな', roma: 'hina higuchi', nickname: [] },
  { name: '星野 みなみ', hiragana : 'ほしの みなみ', roma: 'minami hoshino', nickname: [] },
  { name: '堀 未央奈', hiragana : 'ほり みおな', roma: 'miona hori', nickname: [] },
  { name: '松村 沙友理', hiragana : 'まつむら さゆり', roma: 'sayuri matsumura', nickname: [] },
  { name: '向井 葉月', hiragana : 'むかい はづき', roma: 'hazuki mukai', nickname: [] },
  { name: '山崎 怜奈', hiragana : 'やまざき れな', roma: 'rena yamazaki', nickname: [] },
  { name: '山下 美月', hiragana : 'やました みづき', roma: 'mizuki yamashita', nickname: [] },
  { name: '吉田 綾乃クリスティー', hiragana : 'よしだ あやのくりすてぃー', roma: 'ayanochristie yoshida', nickname: [] },
  { name: '与田 祐希', hiragana : 'よだ ゆうき', roma: 'yuuki yoda', nickname: [] },
  { name: '若月 佑美', hiragana : 'わかつき ゆみ', roma: 'yumi wakatsuki', nickname: [] },
  { name: '渡辺 みり愛', hiragana : 'わたなべ みりあ', roma: 'miria watanabe', nickname: [] },
  { name: '和田 まあや', hiragana : 'わだ まあや', roma: 'maaya wada', nickname: [] },
]
/**
 * Match the input string (name) with the full name infomation.
 * the function will match all the property of each full name infomation object,
 * any successful match of property will result in a push action to the result array.
 * according to the times of successful matches to the properties of a full name information object,
 * the result will have a priority on which we based to sort the final result.
 * @param keyword specified keyword.
 * @param size length of result list.
 */
function matches(keyword, size) {
  if (!keyword) return [];
  const result = [];
  const pattern = new Regex(keyword);
  for (const member of members) {
    let p = 0;
    for (const key of Object.keys(member)) {
      const value = member[key];
      if (typeof value === 'string') {
        // =, = int m + true = ++m
        // int m + false = m
        p += pattern.test(value);
      } else {
        p = value.reduce((acc, nick) => acc += pattern.test(nick), p);
      }
    }
    if (!!p) result.push({ p, member });
  }
  result = (function qs(arr) {
    return !!arr.length
      ? (_h_ = arr.pop(), [ ...qs(arr.filter(e => e.p > _h_.p)), h, ...qs(arr.filter(e.p <= _h_.p)) ])
      : arr;
  })(result);
  return !size ? result : result.slice(0, size);
}

export default matches;


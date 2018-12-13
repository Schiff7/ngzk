// member names.
class Members { 
  constructor() {
    this.sign = ' ';
    this.names = [
      'manatsu akimoto', 'erika ikuta', 'karin itou', 'jyunna itou', 'riria itou',
      'sayuri inoue', 'renka iwamoto', 'minami umezawa', 'misa etou', 'momoko oozono',
      'hina kawago', 'hinako kitano', 'shiori kubo', 'asuka saitou', 'yuuri saitou',
      'tamami sakaguchi', 'reika sakurai', 'kotoko sasaki', 'kaede satou', 'mai shiraishi',
      'mai shinuchi', 'ayane suzuki', 'kazumi takayama', 'ranze terada', 'kana nakada',
      'reno nakamura', 'nanase nishino', 'ami noujou', 'hina higuchi', 'minami hoshino',
      'miona hori', 'sayuri matsumura', 'hazuki mukai', 'rena yamazaki', 'mizuki yamashita',
      'ayanochristie yoshida', 'yuuki yoda', 'yumi wakatsuki', 'miria watanabe', 'maaya wada',
    ];
  }

  with(names, sign) {
    this.names = names;
    this.sign = sign;
    return this;
  }

  /**
   * 
   * @param {*} sign have no limit but it would be better to use ones like `_`, `.`, etc. you can not use this.reverse after
   * you specifying the sign with a character could not been distinguish from other characters in the name. 
   */
  namespace(sign) {
    return new Members().with(this.names.map(name => name.replace(this.sign, sign)), sign);
  }

  reverse() {
    return new Members().with(this.names.map(name => name.split(this.sign).reverse().join(this.sign)), this.sign);
  }
}


module.exports = new Members();
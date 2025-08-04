const OriginalDate = global.Date;

class CustomDate extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      const utcNow = new OriginalDate();
      const offset = -3; // Horário de Brasília (UTC-3)
      const now = new OriginalDate(utcNow.getTime() + offset * 60 * 60 * 1000);
      return now; 
    }
    return new OriginalDate(...args);
  }
}

CustomDate.now = function () {
  const utcNow = new OriginalDate();
  const offset = -3; // Horário de Brasília (UTC-3)
  return utcNow.getTime() + offset * 60 * 60 * 1000;
};

CustomDate.parse = OriginalDate.parse;
CustomDate.UTC = OriginalDate.UTC;

global.Date = CustomDate;

export default CustomDate;

/**
 * Geração de payload PIX "BR Code" (padrão EMV QRCPS do Banco Central),
 * 100% client-side — funciona em hospedagem estática.
 *
 * Porta direta de src/lib/pix.ts. Precisa ser carregado depois de config.js.
 */

var PixUtils = (function () {
  /** Campo EMV: ID + tamanho + valor */
  function emv(id, value) {
    value = String(value);
    var len = String(value.length).padStart(2, "0");
    return id + len + value;
  }

  /** CRC16-CCITT */
  function crc16(payload) {
    var crc = 0xffff;

    for (var i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;

      for (var j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }

    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  /** Normaliza nome/cidade */
  function normalizeMerchantText(value, max) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .toUpperCase()
      .trim()
      .slice(0, max);
  }

  /** Gera o PIX Copia e Cola */
  function buildPixPayload(opts) {
    var merchant = normalizeMerchantText(opts.merchantName, 25);

    var city = normalizeMerchantText(opts.merchantCity, 15);

    var cleanKey = String(opts.key).replace(/\D/g, "");

    /*
     * PIX Merchant Account Information
     *
     * 00 = GUI
     * 01 = chave PIX
     */
    var merchantAccount = emv("00", "BR.GOV.BCB.PIX") + emv("01", cleanKey);

    merchantAccount = emv("26", merchantAccount);

    /*
     * Montagem do BR Code
     */
    var base =
      emv("00", "01") +
      merchantAccount +
      emv("52", "0000") +
      emv("53", "986") +
      emv("54", Number(opts.amount).toFixed(2)) +
      emv("58", "BR") +
      emv("59", merchant) +
      emv("60", city) +
      emv("62", emv("05", String(opts.txid).slice(0, 25))) +
      emv("63", "0000");

    /*
     * CRC deve ser calculado incluindo:
     * 6304 + 0000
     */
    var crc = crc16(base);

    return base.slice(0, -4) + crc;
  }

  /** Sinal de 50% */
  function calcSignal(total) {
    return Math.round(Number(total) * 50) / 100;
  }

  /** Formata dinheiro */
  function formatBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  /** Gera TXID */
  function buildTxid(prefix) {
    var ts = Date.now().toString(36).toUpperCase();
    var rand = Math.random().toString(36).slice(2, 8).toUpperCase();

    return String(prefix + ts + rand)
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 25);
  }

  return {
    crc16: crc16,
    buildPixPayload: buildPixPayload,
    calcSignal: calcSignal,
    formatBRL: formatBRL,
    buildTxid: buildTxid,
  };
})();

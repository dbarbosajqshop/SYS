import Stock from "../stock/schemas/stock.schema.js";
import Street from "../street/schemas/street.schema.js";
import Build from "../build/schema/build.schema.js";
import Floor from "./schema/floor.schema.js";

export default class FloorService {
  static async createLocalName(buildId, floorCode) {
    const build = await Build.findById(buildId);
    if (!build) {
      throw new Error('Build not found');
    }
    const street = await Street.findById(build.StreetId);
    if (!street) {
      throw new Error('Street not found');
    }
    const stock = await Stock.findById(street.StockId);
    if (!street) {
      throw new Error('Street not found');
    }

    const completeFloorCode = `${stock.code}${street.code}${build.code}${floorCode}`;
    return completeFloorCode;
  }

  static async parseCompleteFloorCode(completeFloorCode) {
    if (!completeFloorCode || completeFloorCode.length < 12) {
      throw new Error('Código inválido.');
    }

    const stockCode = completeFloorCode.substring(0, 3);  
    const isStockCodeValid = await Stock.findOne({code: stockCode});
    if(!isStockCodeValid) throw new Error('Não existe estoque com este código.');

    const streetCode = completeFloorCode.substring(3, 6); 
    const isStreetCodeValid = await Street.findOne({code: streetCode});
    if(!isStreetCodeValid) throw new Error('Não existe rua com este código.');
    
    const buildCode = completeFloorCode.substring(6, 9);  
    const isBuildCodeValid = await Build.findOne({code: buildCode});
    if(!isBuildCodeValid) throw new Error('Não existe prédio com este código.');
    
    const floorCode = completeFloorCode.substring(9, 12);
    const isFloorCodeValid = await Floor.findOne({code: floorCode});
    if(!isFloorCodeValid) throw new Error('Não existe andar com este código.');


    return {
      stockCode,
      streetCode,
      buildCode,
      floorCode
    };
  }
}
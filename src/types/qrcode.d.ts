declare module 'qrcode' {
  export interface QRCodeData {
    modules: {
      size: number;
      data: Uint8Array;
      get(row: number, col: number): boolean;
    };
  }
  export function create(text: string, options?: any): QRCodeData;
  const QRCode: {
    create(text: string, options?: any): QRCodeData;
  };
  export default QRCode;
}

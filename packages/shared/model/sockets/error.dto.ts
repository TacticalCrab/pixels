export enum ErrorTypes {
    UPDATE_PIXEL_NOT_ALLOWED = 'UPDATEPIXEL_NOT_ALLOWED',
}

export interface ErrorResponse {
    error: ErrorTypes;
    message: string;
}
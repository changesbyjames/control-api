export const ErrCameraNotSet      = new Error("Camera not set on context");
export const ErrUnableToCallVAPIX = (cause: any) => new Error("Unable to make VAPIX call", { cause: cause });
export const ErrVAPIXCallFailed   = (cause: any) => new Error("VAPIX call failed", { cause: cause });

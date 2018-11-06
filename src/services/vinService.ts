// import { get } from "../utils/https"

// const invalidChars = new RegExp(/[I]/, "g")
export const filter = (vin: string) => vin

export const validate = (_vin: string): string => null

export const convert = (_res: VinCheckResponse): CarInfo => {
    const isUndef = typeof _res === "undefined"
    const isNull = _res == null
    if (isUndef || isNull) {
        return null
    }
    const isInvalid = typeof _res.Results === "undefined"
    if (isInvalid) {
        return null
    }
    const isEmpty = _res.Results.length === 0
    if (isEmpty) {
        return null
    }
    return {
        make: "foo",
        model: "bar",
        year: 0,
        trim: "quux",
        vechicleType: "baz"
    }
}

export const apiCheck = async (_vin: string): Promise<CarInfo> => null

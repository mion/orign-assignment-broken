// import { get } from "../utils/https"

// const invalidChars = new RegExp(/[I]/, "g")
export const filter = (vin: string) => vin

export const validate = (_vin: string): string => null

const CAR_INFO_CONVERT_FUNC_BY_NHTSA_API_VARIABLE_NAME = {
    Make: (val: string): object => {
        return { make: val }
    },
    Model: (val: string) => {
        return { model: val }
    },
    "Model Year": (val: string) => {
        return { year: parseInt(val, 10) }
    },
    Trim: (val: string) => {
        return { trim: val }
    },
    "Vehicle Type": (val: string) => {
        return { vehicleType: val }
    }
}

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

    const carInfo: CarInfo = {
        make: null,
        model: null,
        year: null,
        trim: null,
        vehicleType: null
    }
    return _res.Results.map(result => {
        const convertFunc = CAR_INFO_CONVERT_FUNC_BY_NHTSA_API_VARIABLE_NAME[result.Variable]
        return typeof convertFunc !== "undefined" ? convertFunc(result.Value) : {}
    }).reduce((prev, curr) => {
        return { ...prev, ...curr }
    }, carInfo)
}

export const apiCheck = async (_vin: string): Promise<CarInfo> => null

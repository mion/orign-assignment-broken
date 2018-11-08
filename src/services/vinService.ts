import { get } from "../utils/https"

const invalidChars = new RegExp(/[ioqIOQ]/, "g")
export const filter = (vin: string) => {
    return vin
        .toUpperCase()
        .replace(invalidChars, "")
        .substring(0, 17)
}

const invalidLengthErrorMsg = "17 chars expected"
export const validate = (_vin: string): string => {
    if (_vin.length !== 17) {
        return invalidLengthErrorMsg
    } else {
        return null
    }
}

const convertFuncForVariable: { [key: string]: (val: string) => Object } = {
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

    let carInfo: CarInfo = {
        make: null,
        model: null,
        year: null,
        trim: null,
        vehicleType: null
    }
    _res.Results.forEach(result => {
        const convertFunc = convertFuncForVariable[result.Variable]
        if (typeof convertFunc !== "undefined") {
            carInfo = { ...carInfo, ...convertFunc(result.Value) }
        }
    })
    return carInfo
}

export const apiCheck = async (_vin: string): Promise<CarInfo> =>
    new Promise<CarInfo>((resolve, reject) => {
        const serverErrorMsg = "Our servers are down, this is not your fault. Please try again later."
        const defaultErrorMsg = "Network failure. Please try again later."
        get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${_vin}?format=json`)
            .then(res => {
                // TODO: how to handle this? ie, what happens in TS if type conv fails?
                const carInfo = convert(res as VinCheckResponse)
                if (carInfo === null) {
                    reject(new Error(defaultErrorMsg))
                } else {
                    resolve(carInfo)
                }
            })
            .catch(err => {
                const msg = err.name === "serverError" ? serverErrorMsg : defaultErrorMsg
                reject(new Error(msg))
            })
    })

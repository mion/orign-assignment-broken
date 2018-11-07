interface CarInfo {
    make: string
    model: string
    year: number
    trim: string
    vehicleType: string
}

interface VinResultEntry {
    Value: string
    ValueId: string
    Variable: string
    VariableId: number
}

interface VinCheckResponse {
    Results: VinResultEntry[]
}

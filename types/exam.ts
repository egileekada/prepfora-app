

export interface IExam {
    name: string,
    displayName: string,
    code: string,
    category: string,
    aliases: string[],
    questionCount: number,
    features: {
        hasPassages: boolean,
        hasEquations: boolean,
        hasDiagrams: boolean
    },
    examTypes: string[],
    yearRange: {
        min: number,
        max: number
    }
}

export interface IDataExam {
    subjects: IExam[]
}
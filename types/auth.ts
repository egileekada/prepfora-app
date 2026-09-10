
export interface IAuth {
    email: string;
}

export interface IAuthOtp {
    email: string;
    otp: string;
}

export interface IAuthUser {
    first_name: string,
    last_name: string,
    state: string,
    university: string,
    phone: string,
    current_examination_date: string,
    examinations: string[],
    current_expectation: string
}

export interface IUniversity {
    abbreviation: string
    city: string
    name: string
    state: string
    type: string | null
    website: string
}
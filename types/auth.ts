
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

export interface IUserProfile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    state: string | null;
    phone: string | null;
    current_examination_date: string | null;
    university: string | null;
    examinations: string[] | null;
    current_expectation: string | null;
    prep_points: number | null;
    best_score: number | null;
}

export interface IUpdateUserPayload {
    first_name?: string | null;
    last_name?: string | null;
    state?: string | null;
    university?: string | null;
    examinations?: string[] | null;
    current_expectation?: string | null;
    phone?: string | null;
    current_examination_date?: string | null;
}
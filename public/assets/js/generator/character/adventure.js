
class Adventure {
    constructor(data = {}) {
        this.event_id   = parseInt(data.event_id) ?? null;
        this.question_1 = data.question_1 ?? null;
        this.question_2 = data.question_2 ?? null;
        this.question_3 = data.question_3 ?? null;
        this.question_4 = data.question_4 ?? null;
        this.question_5 = data.question_5 ?? null;
        this.question_6 = data.question_6 ?? null;
    }

    // Example method to check if all questions except 6 are answered
    allAnswered() {
        return [this.question_1, this.question_2, this.question_3, this.question_4, this.question_5]
            .every(q => q !== null && q !== '');
    }
}

export {
    Adventure
}
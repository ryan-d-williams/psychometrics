import AnalyticValue from "./AnalyticValue.js";
export const tools = { calculateDifficultyIndex, calculateStudentScoreAndRank, calculateDiscriminationIndex, calculateKR20, calculatePointBiserial, calculateInterItemCorrelation, setStatistics, calculateExternalValidation }

let Statistics;

function setStatistics(stats) {
    Statistics = stats;
}

function getTotalAndMaxForQuestion(assignment, question) {
    let question_max = 0;
    const total_sum = assignment.reduce((acc, student) => {
        if (student[question] > question_max) {
            question_max = student[question];
        }
        return student[question] + acc
    }, 0);

    return [total_sum, question_max];
}

function calculateDifficultyIndex(assignment, question_names, question_data) {
    const num_students = assignment.length;
    question_names.forEach((question, index) => {
        const [total_sum, question_max] = getTotalAndMaxForQuestion(assignment, question)
        const difficulty_index = total_sum / num_students / question_max;
        question_data[index].difficulty_index = new AnalyticValue(difficulty_index, AnalyticValue.AnalyticTypes.Difficulty_Index);
    });
}

function calculateStudentScoreAndRank(assignment, question_names) {
    assignment.forEach(student => {
        student.score = question_names.reduce((acc, question_name) => student[question_name] + acc, 0);
    });

    assignment.sort((stud1, stud2) => {
        return stud1.score < stud2.score ? 1 : -1;
    });

    assignment.forEach((student, index) => {
        student.rank = index + 1;
    });
}

function calculateDiscriminationIndex(assignment, question_names, question_data) {
    const num_students = assignment.length;

    const upper_27_percent_end = Math.floor(num_students * 0.27);
    const num_students_upper = upper_27_percent_end;
    const lower_27_percent_start = num_students - Math.floor(num_students * 0.27);
    const num_students_lower = num_students - lower_27_percent_start;

    question_names.forEach((question_name, index) => {
        const students_upper = assignment.filter(student => student.rank <= upper_27_percent_end);
        const [total_sum_upper, question_max_upper] = getTotalAndMaxForQuestion(students_upper, question_name)
        let difficulty_upper = total_sum_upper / num_students_upper / question_max_upper;

        const students_lower = assignment.filter(student => student.rank >= lower_27_percent_start);
        const [total_sum, question_max_lower] = getTotalAndMaxForQuestion(students_lower, question_name)
        let difficulty_lower = total_sum / num_students_lower / question_max_upper;

        question_data[index].difficulty_upper = new AnalyticValue(difficulty_upper, AnalyticValue.AnalyticTypes.Upper_Difficulty_Index);
        question_data[index].difficulty_lower = new AnalyticValue(difficulty_lower, AnalyticValue.AnalyticTypes.Lower_Difficulty_Index);
        question_data[index].discrimination_index = new AnalyticValue(difficulty_upper - difficulty_lower, AnalyticValue.AnalyticTypes.Discrimination_Index);
    })

}

function calculateKR20(assignment, question_names, question_data) {
    const num_questions = question_names.length;
    const num_students = assignment.length;

    let question_metadata = [];

    question_names.forEach((question_name, index) => {
        const number_correct = assignment.filter(student => {
            return student[question_name] == 1;
        }).length;

        const number_incorrect = num_students - number_correct;

        const proportion_correct = number_correct / num_students;
        const proportion_incorrect = number_incorrect / num_students;

        const pq = proportion_correct * proportion_incorrect;

        question_metadata[index] = {
            question_name: question_name,
            pq: pq,
            number_correct: number_correct
        };
    });

    let stats = new Statistics(assignment, {
        "score": "metric"
    });
    const variance = (stats.variance("score"));
    const sum_pq = question_metadata.reduce((acc, question) => {
        return acc += question.pq;
    }, 0)

    const KR_20 = (num_questions / (num_questions - 1)) * (1 - sum_pq / variance);

    return new AnalyticValue(KR_20, AnalyticValue.AnalyticTypes.KR_20);
}

function calculatePointBiserial(assignment, question_names, question_data) {
    let question_metadata = [];
    question_names.forEach((question_name, question_index) => {
        const question_scores = assignment.map(student => student[question_name]);
        const sum_of_others = assignment.map(student => student.score - student[question_name]);

        question_scores.forEach((score, index) => {
            question_metadata[index] = {
                [question_name]: score,
                sum_of_others: sum_of_others[index]
            };

            let stats = new Statistics(question_metadata, {
                [question_name]: "metric",
                "sum_of_others": "metric"
            });
            const correl = stats.correlationCoefficient(question_name, "sum_of_others");
            question_data[question_index].point_biserial = new AnalyticValue(correl.correlationCoefficient, AnalyticValue.AnalyticTypes.Point_Biserial);
        });
    });
}

function calculateInterItemCorrelation(assignment, question_names, gradientArray) {
    const num_questions = question_names.length;

    let opts = {};
    question_names.forEach((question_name) => {
        opts[question_name] = "metric";
    })

    let stats = new Statistics(assignment, opts);

    let matrix = Array.from({
        length: num_questions
    }, () => new Array(num_questions).fill({
        val: 1,
        color: gradientArray[9]
    }));

    for (let i = 0; i <= question_names.length - 2; i++) {
        for (let j = i + 1; j <= question_names.length - 1; j++) {
            let correl = stats.correlationCoefficient(question_names[i], question_names[j]);
            //console.log(`${question_names[i]} vs ${question_names[j]} = ${correl.correlationCoefficient}`);
            let coeff = correl.correlationCoefficient;
            let color = gradientArray[Math.floor(Math.abs(coeff) * 10)];
            let data = {
                val: coeff.toFixed(2),
                color: color
            }
            matrix[i][j] = data;
            matrix[j][i] = data;
        }
    }

    return matrix;
}

function calculateExternalValidation(assignments, gradientArray) {
    const assignment_names = assignments.map(assignment => assignment.name);
    let combinedAssignmentData = [];
    assignments.forEach((assignment, assignment_ndx) => {
        const question_names = Object.keys(assignment.data[0]);
        calculateStudentScoreAndRank(assignment.data, question_names);
        assignment.data.forEach((student, ndx) => {
            if (assignment_ndx == 0) {
                combinedAssignmentData.push({});
            }
            combinedAssignmentData[ndx][assignment.name] = student.score;
        });
    });

    const num_assignments = assignment_names.length;

    let opts = {};
    assignment_names.forEach((assignment_name) => {
        opts[assignment_name] = "metric";
    })

    let stats = new Statistics(combinedAssignmentData, opts);

    let matrix = Array.from({
        length: num_assignments
    }, () => new Array(num_assignments).fill({
        val: 1,
        color: gradientArray[9]
    }));

    for (let i = 0; i <= assignment_names.length - 2; i++) {
        for (let j = i + 1; j <= assignment_names.length - 1; j++) {
            let correl = stats.correlationCoefficient(assignment_names[i], assignment_names[j]);
            let coeff = correl.correlationCoefficient;
            let color = gradientArray[Math.floor(Math.abs(coeff) * 10)];
            let data = {
                val: coeff.toFixed(2),
                color: color
            }
            matrix[i][j] = data;
            matrix[j][i] = data;
        }
    }

    return matrix;


}
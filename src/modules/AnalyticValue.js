import AnalyticWarning from "./AnalyticWarning";

export default class AnalyticValue {
    value = 0;
    display_val = "0.00";
    warning_low = false;
    warning_high = false;
    static warning_counter = 0;
    warning_number;

    constructor(_value, analyticType) {
        if (_value !== undefined) {
            this.value = _value;
            this.display_val = _value.toFixed(2);

            if (analyticType === AnalyticValue.AnalyticTypes.Difficulty_Index) {
                this.warning_low = new AnalyticWarning(this.value < 0.2);
                this.warning_high = new AnalyticWarning(this.value > 0.8);
            } else if (analyticType === AnalyticValue.AnalyticTypes.Upper_Difficulty_Index) {
                this.warning_low = new AnalyticWarning(this.value < 0.5);
            } else if (analyticType === AnalyticValue.AnalyticTypes.Lower_Difficulty_Index) {
                this.warning_high = new AnalyticWarning(this.value > 0.9);
            } else if (analyticType === AnalyticValue.AnalyticTypes.Discrimination_Index) {
                this.warning_low = new AnalyticWarning(this.value < 0.2);
            } else if (analyticType === AnalyticValue.AnalyticTypes.Point_Biserial) {
                this.warning_low = new AnalyticWarning(this.value < 0.25);
            }

            if (this.warning_low) {
                this.warning_number = AnalyticValue.warning_counter;
                AnalyticValue.warning_counter++;
            }
        }
    }

    static AnalyticTypes = {
        "Difficulty_Index": 0,
        "Upper_Difficulty_Index": 1,
        "Lower_Difficulty_Index": 2,
        "Discrimination_Index": 3,
        "KR_20": 4,
        "Point_Biserial": 5
    }
}
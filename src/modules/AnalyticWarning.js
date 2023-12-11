export default class AnalyticWarning {
    static warning_counter = 0;
    is_active;
    warning_number;

    constructor(_is_active) {
        this.is_active = _is_active;
        if (this.is_active) {
            this.warning_number = AnalyticWarning.warning_counter++;
        }
    }
}
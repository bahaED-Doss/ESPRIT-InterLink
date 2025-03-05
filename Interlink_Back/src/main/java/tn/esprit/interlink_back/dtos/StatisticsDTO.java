package tn.esprit.interlink_back.dtos;

public class StatisticsDTO {
    private long active;
    private long completed;
    private long onHold;
    private long total;

    // Getters and Setters
    public long getActive() {
        return active;
    }

    public void setActive(long active) {
        this.active = active;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getOnHold() {
        return onHold;
    }

    public void setOnHold(long onHold) {
        this.onHold = onHold;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}

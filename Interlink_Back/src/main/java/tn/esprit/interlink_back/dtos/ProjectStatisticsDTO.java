package tn.esprit.interlink_back.dtos;

public class ProjectStatisticsDTO  {

    private String status;
    private Long count;

    public ProjectStatisticsDTO () {
    }

    // Constructor with arguments
    public ProjectStatisticsDTO (String status, Long count) {
        this.status = status;
        this.count = count;
    }

    // Getters and setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}

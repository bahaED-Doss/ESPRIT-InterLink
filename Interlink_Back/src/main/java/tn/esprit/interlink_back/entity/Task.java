package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.Data;

import lombok.Getter;
import lombok.Setter;
import tn.esprit.interlink_back.entity.Enums.SatisfactionRating;
import tn.esprit.interlink_back.entity.Enums.TaskPriority;
import tn.esprit.interlink_back.entity.Enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
@Data
@Entity
@Getter
@Setter

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;
    private String title;
    private String description;
    private Date deadline ;
    private LocalDateTime CreatedAt;
    private int timer ;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority ;
    @Enumerated(EnumType.STRING)
    private TaskStatus status; // TO_DO , IN_PROGRESS , DONE
    @Enumerated(EnumType.STRING)
    private SatisfactionRating rating;  // 🔥, 👍, 🤔, ⚠️


    /////////////////////////////////////////////////////////:---------////////
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User projectManager;

    // A Student is assigned to work on the task
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks;


    @ManyToOne
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;






    public Task() {}

    public Task(String title, String description, Date deadline, LocalDateTime createdAt, int timer, TaskPriority priority, TaskStatus status, SatisfactionRating rating, User projectManager, User student, List<Feedback> feedbacks, Project project) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        CreatedAt = createdAt;
        this.timer = timer;
        this.priority = priority;
        this.status = status;
        this.rating = rating;
        this.projectManager = projectManager;
        this.student = student;
        this.feedbacks = feedbacks;
        this.project = project;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public SatisfactionRating getRating() {
        return rating;
    }

    public void setRating(SatisfactionRating rating) {
        this.rating = rating;
    }

    public User getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(User projectManager) {
        this.projectManager = projectManager;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }
    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    public float getTimer() {
        return timer;
    }



    public LocalDateTime getCreatedAt() {
        return CreatedAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        CreatedAt = createdAt;
    }

    public void setTimer(int timer) {
        this.timer = timer;
    }
}

package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Enums.TaskStatus;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.services.TaskServices;
import tn.esprit.interlink_back.entity.Task;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private final TaskServices taskServices;

    public TaskController(TaskServices taskServices) {
        this.taskServices = taskServices;
    }

    // Get all tasks for a specific student
    @GetMapping("/students/{studentId}/tasks")
    public List<Task> getTasksByStudentId(@PathVariable Long studentId) {
        return taskServices.getTasksByStudentId(studentId);
    }

    //  Get all tasks for a specific project
    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getTasks(@PathVariable Long projectId) {
        return taskServices.getAllTasksByProjectId(projectId);
    }

    //  Create a new task under a project (MANAGERS ONLY)
    @PostMapping("/projects/{projectId}/tasks/{userId}")
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @PathVariable Long userId, @RequestBody Task task) {
        return ResponseEntity.ok(taskServices.createTask(projectId, task, userId));
    }

    //  Get a specific task from a project
    @GetMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long projectId, @PathVariable Long taskId) {
        return ResponseEntity.ok(taskServices.getTaskByProjectIdAndTaskId(projectId, taskId));
    }

    //  Update task status (Only STUDENTS can change status)
    @PutMapping("/projects/{projectId}/tasks/{taskId}/status/{userId}")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @PathVariable Long userId,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskServices.updateTaskStatus(projectId, taskId, status, userId));
    }

    //  Delete a task (Only MANAGERS can delete)
    @DeleteMapping("/projects/{projectId}/tasks/{taskId}/{userId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long projectId, @PathVariable Long taskId, @PathVariable Long userId) {
        taskServices.deleteTaskByProjectIdAndTaskId(projectId, taskId, userId);
        return ResponseEntity.noContent().build();
    }
}

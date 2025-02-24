package tn.esprit.interlink_back.services;

import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Enums.TaskStatus;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.Task;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.ProjectRepository;
import tn.esprit.interlink_back.repository.TaskRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServices implements ITaskSerevice {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskServices(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    //  Get all tasks for a specific project
    public List<Task> getAllTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    //  Get a specific task by projectId & taskId
    public Task getTaskByProjectIdAndTaskId(Long projectId, Long taskId) {
        return taskRepository.findByProjectIdAndTaskId(projectId, taskId)
                .orElseThrow(() -> new RuntimeException("Task not found in this project"));
    }

    //  Create a task (Only MANAGERS can create tasks)
    public Task createTask(Long projectId, Task task, Long userId) {
        // Add debug logging
        System.out.println("Creating task with projectId=" + projectId + ", userId=" + userId);
        System.out.println("Task payload: " + task);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        System.out.println("Found user: " + user);

        if (user.getRole() != Role.PROJECT_MANAGER) {
            throw new RuntimeException("Only PROJECT_MANAGER can create tasks. Current role: " + user.getRole());
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        System.out.println("Found project: " + project);

        task.setProject(project);
        task.setStatus(TaskStatus.TO_DO);
        task.setCreatedAt(LocalDateTime.now());
        task.setTimer(0);

        Task savedTask = taskRepository.save(task);
        System.out.println("Saved task: " + savedTask);

        return savedTask;
    }

    //  Update Task  Status(Only STUDENTS can change status)
    public Task updateTaskStatus(Long projectId, Long taskId, TaskStatus status, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only STUDENTS can change the task status.");
        }

        Task task = getTaskByProjectIdAndTaskId(projectId, taskId);

        //  Start the timer when the status changes to "DOING"
        if ((status == TaskStatus.IN_PROGRESS) && (task.getStatus() != TaskStatus.IN_PROGRESS)) {
            task.setTimer((int) System.currentTimeMillis()); // Save current timestamp
        }

        task.setStatus(status);
        return taskRepository.save(task);
    }

    //  Delete Task (Only MANAGERS can delete tasks)
    public void deleteTaskByProjectIdAndTaskId(Long projectId, Long taskId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PROJECT_MANAGER) {
            throw new RuntimeException("Only MANAGERS can delete tasks.");
        }

        Task task = getTaskByProjectIdAndTaskId(projectId, taskId);
        taskRepository.delete(task);
    }

}

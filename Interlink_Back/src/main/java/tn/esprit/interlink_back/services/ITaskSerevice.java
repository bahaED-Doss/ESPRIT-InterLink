package tn.esprit.interlink_back.services;

import tn.esprit.interlink_back.entity.Enums.TaskStatus;
import tn.esprit.interlink_back.entity.Task;

import java.util.List;

public interface ITaskSerevice {
    List<Task> getAllTasksByProjectId(Long projectId);
    Task getTaskByProjectIdAndTaskId(Long projectId, Long taskId);
    Task createTask(Long projectId, Task task, Long userId);
    Task updateTaskStatus(Long projectId, Long taskId, TaskStatus status, Long userId);
    void deleteTaskByProjectIdAndTaskId(Long projectId, Long taskId, Long userId);



}

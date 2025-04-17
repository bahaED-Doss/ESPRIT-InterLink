package tn.esprit.interlink_back.service;

import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Enums.StatusType;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.entity.Question;
import tn.esprit.interlink_back.entity.Reponse;
import tn.esprit.interlink_back.repository.ReponseReository;

import java.util.List;

@Service
public class ReponseService {

    public final ReponseReository reponseReository ;
    public final InterviewService interviewService ;
    public final QuestionService questionService ;
    public ReponseService(ReponseReository reponseReository,InterviewService interviewService,QuestionService questionService) {
        this.reponseReository = reponseReository;
        this.interviewService = interviewService;
        this.questionService = questionService;
    }


    @Transactional                  //gérer les transactions au niveau des bases de données.
    public List<Reponse> saveAll(List<Reponse> reponseList,Long idt) {

        int note =0;
        System.err.println("iddd student "+reponseList.get(0).getStudent()+"iddd test"+idt);
        Interview interview = interviewService.getInterviewByIdTestAndIdStudent(reponseList.get(0).getStudent(),idt);

        List<Reponse> result = reponseReository.saveAll(reponseList);
        interviewService.updateInterview(interview.getInterviewId(),interview);
        for (Reponse reponse : result) {
            Question question = questionService.getQuestionById(reponse.getQuestionId()).get();
            note+=question.getNoteAttribuee();
        }
        
        interview.setStatusType(StatusType.REALISE);
        interview.setNote(note);
        return result;
    }

    public List<Reponse> findReponseByQuestion(Long questionId) {
        return reponseReository.findByQuestionId(questionId);
    }

    public List<Reponse> findAllByTestAndStudent( Long studentId, Long testId) {
        return reponseReository.findReponseByStuentAndTest(studentId,testId);
    }

}

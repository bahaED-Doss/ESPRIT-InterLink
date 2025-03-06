package tn.esprit.interlink_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Reponse;
import tn.esprit.interlink_back.service.ReponseService;

import java.util.List;

@RestController
@RequestMapping("/api/reponse")
@CrossOrigin(origins = "http://localhost:4200")
public class ReponseController {


    private final ReponseService reponseService;

    public ReponseController(ReponseService reponseService) {
        this.reponseService = reponseService;
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<List<Reponse>> addRespons(@RequestBody List<Reponse> reponseList,@PathVariable Long id) {
        List<Reponse> savedReponse = reponseService.saveAll(reponseList,id);
        return ResponseEntity.ok(savedReponse);
    }


    @GetMapping("/findByQuestion/{ids}/{idt}")
    public ResponseEntity<List<Reponse>> getAllReponse(@PathVariable Long ids,@PathVariable Long idt) {
        List<Reponse> reponseList = reponseService.findAllByTestAndStudent(ids,idt);
        return ResponseEntity.ok(reponseList);
    }


}

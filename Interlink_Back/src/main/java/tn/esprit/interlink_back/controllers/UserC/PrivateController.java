package tn.esprit.interlink_back.controllers.UserC;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.interlink_back.dtos.MessageDto;

@RestController
public class PrivateController {

    @GetMapping("/messages")
    public ResponseEntity<MessageDto> privateMessages(@AuthenticationPrincipal(expression = "name") String name) {
        return ResponseEntity.ok(new MessageDto("private content " + name));
    }
}
package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.FaceDescriptor;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.FaceRecognitionService;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.Optional;

@Service
public class FaceRecognitionServiceImpl implements FaceRecognitionService {

    private final UserRepository userRepository;

    public FaceRecognitionServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public FaceDescriptor extractDescriptor(byte[] imageBytes) {
        // TODO: Replace with your actual face recognition logic.
        // For testing, we create a dummy descriptor (for example, an array filled with 0.1f).
        float[] dummyDescriptor = new float[128];
        for (int i = 0; i < dummyDescriptor.length; i++) {
            dummyDescriptor[i] = 0.1f;
        }
        return new FaceDescriptor(dummyDescriptor);
    }

    @Override
    public Optional<User> findMatchingUser(FaceDescriptor descriptor) {
        // TODO: Replace with your matching logic. For testing, we simply return a user with a known email.
        // For example, if there is a user with email "face@test.com", we return that user.
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail("face@test.com"));
        return userOpt;
    }
}
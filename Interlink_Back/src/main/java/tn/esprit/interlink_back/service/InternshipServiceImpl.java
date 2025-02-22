package tn.esprit.interlink_back.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Internship;
import tn.esprit.interlink_back.repository.InternshipRepository;

import java.util.List;
import java.util.Optional;
@Service
@AllArgsConstructor
@Slf4j
public class InternshipServiceImpl implements IInternshipService {

      InternshipRepository internshipRepository;

    @Override
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    @Override
    public Optional<Internship> getInternshipById(Long id) {
        return internshipRepository.findById(id);
    }

    @Override
    public Internship createInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    @Override
    public Internship updateInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    @Override
    public void deleteInternship(Long id) {
        internshipRepository.deleteById(id);
    }
}

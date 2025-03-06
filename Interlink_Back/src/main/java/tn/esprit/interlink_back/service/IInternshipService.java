package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.Internship;
import tn.esprit.interlink_back.repository.InternshipRepository;

import java.util.List;
import java.util.Optional;

public interface IInternshipService {
    List<Internship> getAllInternships();

    Optional<Internship> getInternshipById(Long id);

    Internship createInternship(Internship internship);

    public Internship updateInternship(Internship internship);

    void deleteInternship(Long id);

    Internship findInternshipById(Long internshipId);
}
package com.example.shadowingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.shadowingservice.entity.shadowing.ShadowingVideoInterest;

public interface ShadowingVideoInterestRepository extends JpaRepository<ShadowingVideoInterest, Long> {

	List<ShadowingVideoInterest> findByInterest_InterestId(Long interestId);

	@Query("select s.shadowingVideo.videoId from ShadowingVideoInterest s where s.interest.interestId = :interestId")
	List<Long> findAllVideoId(Long interestId);

}

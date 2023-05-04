package com.example.challengeservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.challengeservice.entity.challenge.Challenge;
import com.example.challengeservice.entity.challenge.MemberChallenge;

@Repository
public interface MemberChallengeRepository extends JpaRepository<MemberChallenge, Long> {
    int countByChallenge(Challenge challenge);
    @Query("select mc from MemberChallenge mc where mc.challenge.challengeId=:challengeId")
    List<MemberChallenge> findAllByChallengeId(Long challengeId);
}
package com.example.challengeservice.repository;

import com.example.challengeservice.entity.challenge.Love;
import com.example.challengeservice.entity.challenge.MemberChallenge;
import com.example.challengeservice.entity.member.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoveRepository extends JpaRepository<Love, Long> {
	int countByMemberChallenge(MemberChallenge memberChallenge);

	int countByMemberChallengeAndMember_MemberId(MemberChallenge memberChallenge, Long memberId);

	Optional<Love> findByMemberChallengeAndMember(MemberChallenge memberChallenge, Member member);

	int countByMemberChallengeAndMember(MemberChallenge memberChallenge, Member member);
	List<Love> findAllByMemberChallenge_MemberChallengeId(Long memberChallengeId);
}

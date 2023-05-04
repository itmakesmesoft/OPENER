package com.example.shadowingservice.dto.response;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginShadowingDetailDto {

	private LocalTime start;
	private LocalTime end;
	private String engCaption;
	private String KorCaption;
	private int repeat;
	private boolean isMarked;

}

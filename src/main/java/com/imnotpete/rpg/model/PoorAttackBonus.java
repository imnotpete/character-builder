package com.imnotpete.rpg.model;

public class PoorAttackBonus implements BaseAttackBonus {

	@Override
	public int getBonus(int level) {
		return level/2;
	}

}

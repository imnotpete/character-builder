package com.imnotpete.rpg.model;

public class GoodAttackBonus implements BaseAttackBonus {

	@Override
	public int getBonus(int level) {
		return level;
	}

}

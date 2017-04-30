package com.imnotpete.rpg.model;

public class AverageAttackBonus implements BaseAttackBonus {

	int[] bonus = {0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15};
	
	@Override
	public int getBonus(int level) {
		return bonus[level+1];
	}

}

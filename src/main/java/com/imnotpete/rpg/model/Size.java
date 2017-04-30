package com.imnotpete.rpg.model;

public enum Size {
	SMALL(1, -4, 4), MEDIUM(0, 0, 0), LARGE(-1, 4, -4);
	
	public int armorAcMod;
	public int grappleMod;
	public int hideMod;
	
	Size(int armorAcMod, int grappleMod, int hideMod) {
		this.armorAcMod = armorAcMod;
		this.grappleMod = grappleMod;
		this.hideMod = hideMod;
	}
}

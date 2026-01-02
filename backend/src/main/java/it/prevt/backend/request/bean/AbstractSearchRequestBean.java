package it.prevt.backend.request.bean;

public class AbstractSearchRequestBean {
	private Integer firstResult;

	private Integer maxResult;

	public Integer getFirstResult() {
		return firstResult;
	}

	public void setFirstResult(Integer firstResult) {
		this.firstResult = firstResult;
	}

	public Integer getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(Integer maxResult) {
		this.maxResult = maxResult;
	}
}

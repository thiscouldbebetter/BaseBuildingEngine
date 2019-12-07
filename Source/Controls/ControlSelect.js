
function ControlSelect
(
	name,
	bindingGetForOptionText,
	options,
	numberOfOptionsVisible,
	allowNullSelection,
	bindingGetForOptionValue,
	bindingForSelectedValue
)
{
	this.name = name;
	this.bindingGetForOptionText = bindingGetForOptionText;
	this.options = options;
	this.numberOfOptionsVisible = (numberOfOptionsVisible == null ? 1 : numberOfOptionsVisible);
	this.allowNullSelection = (allowNullSelection == null ? false : allowNullSelection);
	this.bindingGetForOptionValue = bindingGetForOptionValue;
	this.bindingForSelectedValue = bindingForSelectedValue;
}

{
	ControlSelect.OptionNoneValueAndText = "[none]";

	ControlSelect.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			var _domElement = document.createElement("select");
			_domElement.size = this.numberOfOptionsVisible;
			var bindingForSelectedValue = this.bindingForSelectedValue;
			_domElement.onchange = function()
			{
				var valueSelected = _domElement.value;
				if (valueSelected == ControlSelect.OptionNoneValueAndText)
				{
					valueSelected = null;
				}
				bindingForSelectedValue.set(valueSelected);
				// hack
				var world = Globals.Instance.world;
				world.update();
			}

			if (this.allowNullSelection)
			{
				var optionNone = document.createElement("option");
				optionNone.innerHTML = ControlSelect.OptionNoneValueAndText;
				_domElement.appendChild(optionNone);
			}

			for (var i = 0; i < this.options.length; i++)
			{
				var option = this.options[i];
				var optionAsDomElement = document.createElement("option");

				var optionText;
				if (this.bindingGetForOptionText == null)
				{
					optionText = option;
				}
				else
				{
					optionText = this.bindingGetForOptionText(option);
				}
				optionAsDomElement.innerHTML = optionText;

				var optionValue;
				if (this.bindingGetForOptionValue == null)
				{
					optionValue = option;
				}
				else
				{
					optionValue = this.bindingGetForOptionValue(option);
					if (optionValue == null)
					{
						optionValue = i;
					}
				}
				optionAsDomElement.value = optionValue; // todo - Objects implicitly converted to strings here.

				_domElement.appendChild(optionAsDomElement);
			}

			this._domElement = _domElement;
		}

		return this._domElement;
	}
}

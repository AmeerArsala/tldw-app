import numpy as np


# both parameters are ndarray
def pad_or_trim_ndarray(input, target, value_to_pad_with=0):
    if input.shape[0] > target.shape[0]:
        # Trim input to be the same length as target
        return input[:target.shape[0]]
    elif input.shape[0] < target.shape[0]:
        # Pad input with zeros to be the same length as target
        return np.pad(input, (value_to_pad_with, target.shape[0] - input.shape[0]), 'constant')
    else:
        # Input and target are already the same length
        return input
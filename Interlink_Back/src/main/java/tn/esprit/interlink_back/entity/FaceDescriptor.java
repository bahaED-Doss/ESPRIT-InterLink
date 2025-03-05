package tn.esprit.interlink_back.entity;

import java.util.Arrays;

public class FaceDescriptor {
    private float[] descriptor;

    public FaceDescriptor(float[] descriptor) {
        this.descriptor = descriptor;
    }

    public float[] getDescriptor() {
        return descriptor;
    }

    public void setDescriptor(float[] descriptor) {
        this.descriptor = descriptor;
    }

    // Example: Compute Euclidean distance between two descriptors.
    public double distanceTo(FaceDescriptor other) {
        float[] otherDescriptor = other.getDescriptor();
        double sum = 0.0;
        for (int i = 0; i < descriptor.length; i++) {
            sum += Math.pow(descriptor[i] - otherDescriptor[i], 2);
        }
        return Math.sqrt(sum);
    }

    @Override
    public String toString() {
        return Arrays.toString(descriptor);
    }
}